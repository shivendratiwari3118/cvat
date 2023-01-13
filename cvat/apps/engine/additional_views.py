from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from .crop_images_label_corrector import label_generator_crop
from .serializers import *
from django.shortcuts import get_object_or_404

def img_to_base64(img):
    import base64
    with open(img, "rb") as img_file:
        return "data:image/jpeg;base64,"+str(base64.b64encode(img_file.read())).replace("b'","").replace("'","")


# class ProjectExtraViewSet(viewsets.ModelViewSet):
#     queryset = AdditionalProjectInfo.objects.filter()
#     serializer_class = AdditionalProjectInfoSerializer

#     def retrieve(self, request, pk):
#         # Job.objects.get(id=pk).get_project_id()
#         # queryset = Catfolder.objects.filter(projectid=60)
#         # pk=Job.objects.get(id=pk).get_project_id()
#         data = []
#         # serializer_class = AdditionalProjectInfoSerializer(self.queryset.filter(project_id=Job.objects.get(id=pk).get_project_id()),many=True)
#         # for item in serializer_class.data[0].get("corrector_schema").keys():
#         #     data.append(serializer_class.data[0].get("corrector_schema").get(item)[1])

#         return Response(data)

# start of label corrector

class GetCroppedImages(viewsets.ViewSet):

    @action(detail=True, methods=['GET', 'OPTIONS', 'POST','PUT'])
    def frame_data(self,request,pk):
        task_id = Job.objects.get(id=pk).get_task_id()
        data_id = Task.objects.get(id=task_id).data_id
        image_folder = settings.BASE_DIR+"/data/data/"+str(data_id)+"/raw/"

        # track_id = 291
        track_id = request.GET.get("track_id")
        
        print(track_id,"track_idtrack_idtrack_idtrack_idtrack_id")
        instance_trackedshape = TrackedShape.objects.filter(track_id=track_id).values()
        instance_labeledtrack = LabeledTrack.objects.filter(id=track_id).values()
        job_id=instance_labeledtrack[0]['job_id']
        segmentid = Job.objects.filter(id=job_id).values()[0]['segment_id']
        last_frame = Segment.objects.filter(id=segmentid).values()[0]['stop_frame']


        # instance_trackedshape = TrackedShape.objects.filter(track_id=labe_id).values()
        # instance_labeledtrack = LabeledTrack.objects.filter(id=labe_id).values()

        list_of_instance_trackedshape = list(instance_trackedshape)
        list_of_instance_labeledtrack = list(instance_labeledtrack)
        print("image_folder", image_folder, "list_of_instance_trackedshape", list_of_instance_trackedshape, "list_of_instance_labeledtrack", list_of_instance_labeledtrack)


        data = label_generator_crop(image_folder, list_of_instance_trackedshape, list_of_instance_labeledtrack, last_frame)
        print("label_generator&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")

        # data = "hello"
        return Response(data)


class ProjectExtraViewSet(viewsets.ModelViewSet):
    queryset = AdditionalProjectInfo.objects.filter()
    serializer_class = AdditionalProjectInfoSerializer

    def retrieve(self, request, pk):
        # Job.objects.get(id=pk).get_project_id()
        # queryset = Catfolder.objects.filter(projectid=60)
        # pk=Job.objects.get(id=pk).get_project_id()
        data = []
        serializer_class = AdditionalProjectInfoSerializer(self.queryset.filter(project_id=Job.objects.get(id=pk).get_project_id()),many=True)
        for item in serializer_class.data[0].get("corrector_schema").keys():
            data.append(serializer_class.data[0].get("corrector_schema").get(item)[1])

        return Response(data)

# end of laebl corrector

# class BulkUpdate(viewsets.ModelViewSet):
#     queryset = ''
#     serializer_class = SaveTrackSerializer

#     @action(detail=True, methods=['OPTIONS', 'POST','PUT'], url_path=r'data')
#     def data(self, request,pk):

#         attribute_name = request.data.get('attribute_id')
#         if attribute_name == "SR_MAIN_ID":
#             att = AttributeSpec.objects.get(id=request.data.get('attribute_id'))
#             ltt = LabeledTrack.objects.get(id=int(request.data.get('AnnotationId')))
#             tshape = ltt.trackedshape_set.first()
#             tshape.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_val"))
#             return Response({"message":True})
#         else:

#             att = AttributeSpec.objects.get(id=request.data.get('attribute_id'))
#             ltt = LabeledTrack.objects.get(id=int(request.data.get('AnnotationId')))
#             tshape = ltt.trackedshape_set.first() # FIXME i ah
#             if request.data.get('start_frame') == "start":
#                 request.data['start_frame'] = tshape.frame
#                 TrackedShape.objects.filter(track_id=request.data.get("track_id"), frame = request.data.get("start_frame")).delete() # added to hanlde to remove frames
#             t_start_obj = TrackedShape.objects.create(track=tshape.track,points=tshape.points,type=tshape.type,frame=int(request.data.get('start_frame')))
#             t_end_obj = TrackedShape.objects.create(track=tshape.track,points=tshape.points,type=tshape.type,frame=int(request.data.get('end_frame')))
#             t_start_obj.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_val"))
#             t_end_obj.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_previous_val"))
#             return Response({"message":True})


class BulkUpdate(viewsets.ModelViewSet):
    queryset = ''
    serializer_class = SaveTrackSerializer

    @action(detail=True, methods=['OPTIONS', 'POST','PUT'], url_path=r'data')
    def data(self, request,pk):

        attribute_name = request.data.get('attribute_id')
        if attribute_name == "SR_MAIN_ID":
            att = AttributeSpec.objects.get(id=request.data.get('attribute_id'))
            ltt = LabeledTrack.objects.get(id=int(request.data.get('AnnotationId')))
            tshape = ltt.trackedshape_set.first()
            tshape.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_val"))
            return Response({"message":True})
        else:

            # att = AttributeSpec.objects.get(id=request.data.get('attribute_id'))
            # ltt = LabeledTrack.objects.get(id=int(request.data.get('AnnotationId')))
            # tshape = ltt.trackedshape_set.first() # FIXME i ah
            # if request.data.get('start_frame') == "start":
            #     request.data['start_frame'] = tshape.frame
            #     TrackedShape.objects.filter(track_id=request.data.get("track_id"), frame = request.data.get("start_frame")).delete() # added to hanlde to remove frames
            # t_start_obj = TrackedShape.objects.create(track=tshape.track,points=tshape.points,type=tshape.type,frame=int(request.data.get('start_frame')))
            # t_end_obj = TrackedShape.objects.create(track=tshape.track,points=tshape.points,type=tshape.type,frame=int(request.data.get('end_frame')))
            # t_start_obj.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_val"))
            # t_end_obj.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_previous_val"))
            # started to handle each case in bulk update
            curr_frame = request.data.get('current_frame')
            att = AttributeSpec.objects.get(id=request.data.get('attribute_id'))
            ltt = LabeledTrack.objects.get(id=int(request.data.get('AnnotationId')))
            points = request.data.get('points')
            if request.data.get('case') == "ctoe": # current to end frame 
                # current frame  exists else create and update all next keyframes 
                if ltt.trackedshape_set.filter(frame=curr_frame):
                    for item in ltt.trackedshape_set.filter(frame__gte= curr_frame):
                        item.trackedshapeattributeval_set.filter(spec=att).delete()
                        item.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_val"))
                else:
                    ltt.trackedshape_set.create(frame=curr_frame,type="rectangle",points=points)
                    for item in ltt.trackedshape_set.filter(frame__gte= curr_frame):
                        item.trackedshapeattributeval_set.filter(spec=att).delete()
                        item.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_val"))
            
            elif request.data.get('case') == "stoe": # start to end frame
                for item in ltt.trackedshape_set.all():
                        item.trackedshapeattributeval_set.filter(spec=att).delete()
                        item.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_val"))


            elif request.data.get('case') == "stoc": # start to current frame
                # current frame  exists else create current_frame +1 and update all less than current frames 
                new_curr = curr_frame + 1

                if ltt.trackedshape_set.filter(frame=new_curr):
                    for item in ltt.trackedshape_set.filter(frame__lte= new_curr):
                        item.trackedshapeattributeval_set.filter(spec=att).delete()
                        item.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_val"))
                else:
                    ltt.trackedshape_set.create(frame=new_curr,type="rectangle",points=points)
                    for item in ltt.trackedshape_set.filter(frame__lte= new_curr):
                        item.trackedshapeattributeval_set.filter(spec=att).delete()
                        item.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_val"))
                
                for nitem in ltt.trackedshape_set.filter(frame=new_curr):
                    nitem.trackedshapeattributeval_set.filter(spec=att).delete()
                    nitem.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_previous_val"))

            
                
            elif request.data.get('case') == "range":
                start = request.data.get("start_frame")
                end = request.data.get("end_frame")
                # new_end =  end + 1
                # create if start and end+1 frames not there
                if ltt.trackedshape_set.filter(frame=start):
                    pass
                else:
                    ltt.trackedshape_set.create(frame=start,type="rectangle",points=points)

                if ltt.trackedshape_set.filter(frame=end):
                    pass
                else:
                    ltt.trackedshape_set.create(frame=end,type="rectangle",points=points)

                for item in ltt.trackedshape_set.filter(frame__gte = start):
                        if item.frame < end:
                            item.trackedshapeattributeval_set.filter(spec=att).delete()
                            item.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_val"))
                for nitems in ltt.trackedshape_set.filter(frame=end):
                    nitems.trackedshapeattributeval_set.filter(spec=att).delete()
                    nitems.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_previous_val"))


            return Response({"message":True})



class LabelCorrectorAttrSave(viewsets.ModelViewSet):
    # queryset = AdditionalProjectInfo.objects.filter()
    queryset = ''
    serializer_class = LabelSaveSerializer
    # <'job_id': ['3'], 'trackid': ['33'], 'start_frame': ['333'], 'end_frame': ['33'], 'attribute_name': ['33'], 'attribute_val': ['33']}>
# attribute_id,frame,track_id
    @action(detail=True, methods=['OPTIONS', 'GET', 'POST','PUT'])
    def data(self, request,pk):
        att = AttributeSpec.objects.get(id=request.data.get('attribute_id'))
        ltt = LabeledTrack.objects.get(id=int(request.data.get('AnnotationId')))
        tshape = ltt.trackedshape_set.first() # FIXME i ah
        t_start_obj = TrackedShape.objects.get_or_create(track=tshape.track,points=tshape.points,type=tshape.type,frame=int(request.data.get('frame')))
        tr_att = t_start_obj[0].trackedshapeattributeval_set.get_or_create(spec = att,value = request.data.get("attribute_val","false"))
        # tr_att[0].value = request.data.get("attribute_val")
        # tr_att[0].save()
        prev_val = request.data.get('attributre_previous_value')
        next_frame_id = int(request.data.get('frame')) + 1
        t_next_obj = TrackedShape.objects.get_or_create(track=tshape.track,points=tshape.points,type=tshape.type,frame=next_frame_id)
        tr_att = t_next_obj[0].trackedshapeattributeval_set.get_or_create(spec = att,value = prev_val)
        
        # t_start_obj = TrackedShape.objects.create(track=tshape.track,points=tshape.points,type=tshape.type,frame=int(request.data.get('start_frame')))
        # t_end_obj = TrackedShape.objects.create(track=tshape.track,points=tshape.points,type=tshape.type,frame=int(request.data.get('end_frame')))
        # t_start_obj.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_val"))
        # t_end_obj.trackedshapeattributeval_set.create(spec = att,value=request.data.get("attribute_previous_val"))
        return Response({"message":True})

    
class SaveSRVisibleData(viewsets.ViewSet):
    queryset = ''
    serializer_class = LabelSaveSerializer
    
    @action(detail=True, methods=['GET', 'OPTIONS', 'POST','PUT'])
    def sr_visible(self,request,pk):
        # task_id = Job.objects.get(id=pk).get_task_id()
        if request.method == "POST":
            frame = int(request.data.get("frame"))
            label_id = int(request.data.get("AnnotationId"))
            value  = request.data.get("attribute_val") 
            label = LabeledTrack.objects.get(id=label_id)
            att = AttributeSpec.objects.get(id=request.data.get('attribute_id'))
            tshape = label.trackedshape_set.first()

            if value == "Invisible_Start":
                new_frame = frame - 1
                if new_frame < 0:new_frame = 0  
                t_start_obj = TrackedShape.objects.get_or_create(track=tshape.track,points=tshape.points,type=tshape.type,frame=new_frame)
                new_att = t_start_obj[0].trackedshapeattributeval_set.get_or_create(spec = att)
                if new_att[0].value == "Invisible_Stop":
                    new_att[0].value = "Invisible_Stop_And_Start"
                else:
                    new_att[0].value = "Invisible_Start"
                new_att[0].save()
                t_start_obj = TrackedShape.objects.get_or_create(track=tshape.track,points=tshape.points,type=tshape.type,frame=frame)
                t_start_obj[0].outside = 1
                t_start_obj[0].save()

                next_frame = frame + 1
                t_start_obj = TrackedShape.objects.get_or_create(track=tshape.track,points=tshape.points,type=tshape.type,frame=next_frame)
                t_start_obj[0].outside = 0
                t_start_obj[0].save()
                new_att = t_start_obj[0].trackedshapeattributeval_set.get_or_create(spec = att)
                new_att[0].value = "Invisible_Stop"
                new_att[0].save()

            if value == "Invisible_Stop":
                t_start_obj = TrackedShape.objects.get_or_create(track=tshape.track,points=tshape.points,type=tshape.type,frame=frame)
                t_start_obj[0].outside = 0
                t_start_obj[0].save()
                new_att = t_start_obj[0].trackedshapeattributeval_set.get_or_create(spec = att)
                new_att[0].value = "Invisible_Stop"
                new_att[0].save()

            if value == "Invisible_Stop_And_Start":
                new_frame = frame - 1
                if new_frame < 0:new_frame = 0  
                t_start_obj = TrackedShape.objects.get_or_create(track=tshape.track,points=tshape.points,type=tshape.type,frame=new_frame)
                new_att = t_start_obj[0].trackedshapeattributeval_set.get_or_create(spec = att)
                if new_att[0].value == "Invisible_Stop":
                    new_att[0].value = "Invisible_Stop_And_Start"
                else:
                    new_att[0].value = "Invisible_Start"
                new_att[0].save()
                t_start_obj = TrackedShape.objects.get_or_create(track=tshape.track,points=tshape.points,type=tshape.type,frame=frame)
                t_start_obj[0].outside = 1
                t_start_obj[0].save()
                new_frame = frame + 1
                t_start_obj = TrackedShape.objects.get_or_create(track=tshape.track,points=tshape.points,type=tshape.type,frame=new_frame)
                t_start_obj[0].outside = 0
                t_start_obj[0].save()
                new_att = t_start_obj[0].trackedshapeattributeval_set.get_or_create(spec = att)
                new_att[0].value = "Invisible_Stop"
                new_att[0].save()
            return Response({"message":"true"})
        else:
            return Response({"message":""})

class GetProjectMode(viewsets.ModelViewSet):
    queryset = AdditionalProjectInfo.objects.filter()
    serializer_class = AdditionalProjectTypeInfoSerializer
    
    def retrieve(self,request,pk):
        project_type = get_object_or_404(self.queryset, project_id=Job.objects.get(id=pk).get_project_id())
        serializer = self.serializer_class(project_type)
        return Response(serializer.data)


class JobTrackSummary(viewsets.ViewSet):

    def retrieve(self,request,pk):
        data = []
        job_object = Job.objects.get(id=pk)
        task_object = Task.objects.get(id=job_object.get_task_id())
        if task_object.segment_set.count() > 1 and int(pk) == task_object.segment_set.last().job_set.last().id:
            job_ids = [i[0] for i in task_object.segment_set.values_list('job__id')]
            for num,item in enumerate(job_ids):
                new_data = return_track_summary(item)
                if new_data:
                    data = data + new_data
        else:
            data = return_track_summary(pk)
        return Response(data)


def nav_list(aa,stop_frame):
    import math
    try:
        new_list = []
        for item in aa:
            if len(new_list) == 0:
                if item[1] == True:
                    pass
                else:
                    new_list.append(item)
            else:
                if new_list[-1][1] == item[1]:
                    pass
                else:
                    new_list.append(item)
        rnge_list = []
        cnt = 0
        for i in range(math.ceil(len(new_list)/2)):
            try:
                rnge_list.append(range(new_list[cnt][0],new_list[cnt+1][0]))
                cnt += 2
            except:
                rnge_list.append(range(new_list[cnt][0],stop_frame))
        return [item for sublist in rnge_list for item in sublist]
    except:
        return []


def return_track_summary(pk):
    job = Job.objects.get(id=pk)
    return_list = []
    track_count = 1
    for item in job.labeledtrack_set.all():
        new_dict = {}
        new_sign_class = []
        for j in item.trackedshape_set.all():
            if new_dict.get(item.id):
                new_dict[item.id]['frames'].append(j.frame)
                new_dict[item.id]['ids'].append(j.id)
            else:
                new_dict.update({item.id:{"label":item.label.name,"frames":[j.frame],"ids":[j.id]}})

            try:
                new_sign_class.append(j.trackedshapeattributeval_set.filter(spec__name="SR_SIGN_CLASS").last().value)
            except:
                pass
        last_frame_outside = max(new_dict[item.id]['ids'])
        outside = TrackedShape.objects.get(id=last_frame_outside).outside
        remove_extra_step = 1
        if outside == False:
            remove_extra_step = 0
            new_dict[item.id]['frames'].append(job.segment.stop_frame)
        if new_sign_class:
            new_dict[item.id]['sign_class'] = new_sign_class.pop()
            if Catlog.objects.filter(signname=new_dict[item.id]['sign_class']):
                img_path = Catlog.objects.filter(signname=new_dict[item.id]['sign_class']).last().imagepath
                iimg = img_to_base64(img_path)
            else:
                iimg = ""
            new_dict[item.id]['sign_class_img'] = iimg
        else:
            new_dict[item.id]['sign_class'] = ''
            new_dict[item.id]['sign_class_img'] = ''
        new_dict[item.id]['count'] = max(new_dict[item.id]['frames']) - min(new_dict[item.id]['frames'])
        new_dict[item.id]['start_frame'] = min(new_dict[item.id]['frames'])
        new_dict[item.id]['end_frame'] = max(new_dict[item.id]['frames']) - remove_extra_step # - remove_extra_step added because to remove next step
        if new_dict[item.id]['end_frame'] > job.segment.stop_frame:new_dict[item.id]['end_frame'] = job.segment.stop_frame # added to hanlde last frame
        if TrackedShape.objects.filter(track_id=item.id).values_list('frame','outside').order_by('frame').last()[1] == True:
            new_dict[item.id]['end_frame'] = TrackedShape.objects.filter(track_id=item.id).values_list('frame','outside').order_by('frame').last()[0] - 1# added to hanlde last frame

        new_dict[item.id]['track_id'] = track_count
        new_dict[item.id]['item_id'] = item.id
        track_lists = nav_list(item.trackedshape_set.values_list('frame','outside').order_by('frame'),job.segment.stop_frame)
        new_dict[item.id]['track_frames'] = track_lists
        ##new changes
        new_dict[item.id]['end_frame']= track_lists[-1] if track_lists else 0
        new_dict[item.id]['start_frame']= track_lists[0] if track_lists else 0
        new_dict[item.id]['count']= len(track_lists)

        # end 

        new_dict[item.id].pop('ids')
        new_dict[item.id].pop('frames')
        return_list.append(new_dict[item.id])
        track_count = track_count +1
    return return_list if return_list else []

class GetTrackIds(viewsets.ViewSet):

    @action(detail=True, methods=['GET', 'OPTIONS', 'POST','PUT'])
    def data(self,request,pk):
        job = LabeledTrack.objects.filter(job_id=pk)
        data = []
        counter = 0
        for item in job.values_list('id'):
            data.append({item[0]:counter})
            counter = counter +1
        # data = [i[0] for i in job.values_list('id')]
        return Response({"track_ids":data})

class BlukDeleteFrames(viewsets.ViewSet):

    queryset = ''
    serializer_class = BulkDeleteSerializer
    
    @action(detail=True, methods = ['GET', 'OPTIONS', 'POST','PUT'])
    def bulk_delete(self,request,pk):
        write_logs(request)
        if request.method == "POST":
            points = TrackedShape.objects.filter(track_id = request.data.get("track_id")).last().points
            staart = request.data.get("frame")
            if request.data.get("frame") == "start":
                request.data['frame'] = TrackedShape.objects.filter(track_id = request.data.get("track_id")).first().frame
                TrackedShape.objects.filter(track_id = request.data.get("track_id"), frame__lt = request.data.get("next_frame")).delete()
            TrackedShape.objects.filter(track_id=request.data.get("track_id"), frame = request.data.get("frame")).delete() # added to hanlde to remove frames
            # TrackedShape.objects.create(track_id = request.data.get("track_id"), frame = request.data.get("frame"), outside=True, type = "rectangle", points = points )
            if  staart != "start":
                TrackedShape.objects.create(track_id = request.data.get("track_id"), frame = request.data.get("frame"), outside=True, type = "rectangle", points = points )
            new_next_frame = Job.objects.get(id=pk).segment.stop_frame + 1
            if request.data.get("next_frame") != new_next_frame:
                TrackedShape.objects.create(track_id = request.data.get("track_id"), frame = request.data.get("next_frame"), outside=False, type = "rectangle", points = points )
            else:
                TrackedShape.objects.filter(track_id = request.data.get("track_id"), frame__gt = request.data.get("frame")).delete()
        LabeledTrack.objects.exclude(id__in=TrackedShape.objects.values_list('track_id',flat=True)).delete()
        return Response({"message":"true"})


class DeleteTrack(viewsets.ViewSet):
    @action(detail=True, methods = ['OPTIONS', 'POST','PUT'])
    def delete_tracks(self,request,pk):
        data = request.data # {"track_ids":"[1,2,3]"}
        LabeledTrack.objects.filter(id__in=eval(data.get("track_ids"))).delete()
        return Response({"message":"true"})

# class CopyTrack(viewsets.ViewSet):

#     @action(detail=True, methods = ['OPTIONS', 'POST','PUT'])
#     def paste(self,request,pk):
#         write_logs(request)
#         new_track = request.data.get("new_track")
#         if request.data.get("paste_delete"):
#             print("iffornotttttttttttttt-----------")
#             LabeledTrack.objects.filter(id=new_track).delete()
#             return Response({"message":"true"})
#         ctrack = request.data.get("copied_track")
#         tt = LabeledTrack.objects.get(id=new_track)
#         #tt.trackedshape_set.create(frame=tt.trackedshape_set.last().frame+1,points= tt.trackedshape_set.last().points,outside=True)
#         TrackedShape.objects.filter(track_id=new_track).update(track_id=ctrack)
#         LabeledTrack.objects.filter(id=new_track).delete()
#         # new_track = new_track - 1
#         # LabeledTrack.objects.filter(id=new_track).delete()
#         return Response({"message":"true"})


class CopyTrack(viewsets.ViewSet):

    @action(detail=True, methods = ['OPTIONS', 'POST','PUT'])
    def paste(self,request,pk):
        write_logs(request)
        new_track = request.data.get("new_track")
        if request.data.get("paste_delete"):
            print("iffornotttttttttttttt-----------")
            LabeledTrack.objects.filter(id=new_track).delete()
            return Response({"message":"true"})
        else:
            ctrack = request.data.get("copied_track")
            tt = LabeledTrack.objects.get(id=new_track)
            #tt.trackedshape_set.create(frame=tt.trackedshape_set.last().frame+1,points= tt.trackedshape_set.last().points,outside=True)
            TrackedShape.objects.filter(track_id=new_track).update(track_id=ctrack)
            LabeledTrack.objects.filter(id=new_track).delete()
            # new_track = new_track - 1
            # LabeledTrack.objects.filter(id=new_track).delete()
            return Response({"message":"true"})


            
import os
def write_logs(request):
    curr_directory=os.getcwd()
    final_directory=os.path.join(curr_directory, "Copy_paste")
    if not os.path.exists(final_directory):
        os.makedirs(final_directory)
    os.chdir('Copy_paste')
    file_path=final_directory+"copy_paste.txt"
    ff = open(file_path,"a+")
    ff.writelines(str(request.META))
    ff.writelines(str(request.GET))
    ff.writelines(str(request.POST))
    ff.writelines(str(request.data))
    ff.writelines("#############################################################")
    ff.close()
    return None